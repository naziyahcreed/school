"""
Meta WhatsApp Business API + Twilio SMS fallback messaging gateway.
"""
import logging
from datetime import datetime
from uuid import UUID

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


def build_absence_message_ta(student_name: str, date_str: str, grade: str) -> str:
    return (
        f"🎓 Vidhya Shakthi அறிவிப்பு\n\n"
        f"அன்புள்ள பெற்றோரே,\n"
        f"உங்கள் மகன்/மகள் *{student_name}* ({grade}) "
        f"இன்று ({date_str}) பள்ளிக்கு *வரவில்லை*.\n\n"
        f"தயவுசெய்து விடுப்பு காரணத்தை தெரிவிக்கவும்.\n"
        f"— Vidhya Shakthi OS"
    )


def build_absence_message_en(student_name: str, date_str: str, grade: str) -> str:
    return (
        f"🎓 Vidhya Shakthi Alert\n\n"
        f"Dear Parent,\n"
        f"Your ward *{student_name}* ({grade}) was marked *ABSENT* "
        f"on {date_str}.\n\n"
        f"Please inform the school regarding the absence.\n"
        f"— Vidhya Shakthi OS"
    )


class MessagingService:
    """Dispatches parent alerts via WhatsApp with SMS fallback."""

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def send_whatsapp(self, phone: str, message: str) -> dict:
        if not settings.WHATSAPP_ACCESS_TOKEN or not settings.WHATSAPP_PHONE_NUMBER_ID:
            logger.warning("WhatsApp credentials not configured — simulating send to %s", phone)
            return {"status": "simulated", "message_id": f"sim_{phone}", "channel": "WHATSAPP"}

        normalized_phone = phone.lstrip("+").replace(" ", "")
        url = f"{settings.WHATSAPP_API_URL}/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
        payload = {
            "messaging_product": "whatsapp",
            "to": normalized_phone,
            "type": "text",
            "text": {"preview_url": False, "body": message},
        }
        headers = {
            "Authorization": f"Bearer {settings.WHATSAPP_ACCESS_TOKEN}",
            "Content-Type": "application/json",
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            message_id = data.get("messages", [{}])[0].get("id", "unknown")
            return {"status": "sent", "message_id": message_id, "channel": "WHATSAPP"}

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def send_sms(self, phone: str, message: str) -> dict:
        if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
            logger.warning("Twilio credentials not configured — simulating SMS to %s", phone)
            return {"status": "simulated", "message_id": f"sms_sim_{phone}", "channel": "SMS"}

        url = (
            f"https://api.twilio.com/2010-04-01/Accounts/"
            f"{settings.TWILIO_ACCOUNT_SID}/Messages.json"
        )
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                url,
                auth=(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN),
                data={"From": settings.TWILIO_FROM_NUMBER, "To": phone, "Body": message},
            )
            response.raise_for_status()
            data = response.json()
            return {"status": "sent", "message_id": data.get("sid", "unknown"), "channel": "SMS"}

    async def dispatch_alert(
        self,
        phone: str,
        message_ta: str,
        message_en: str,
        preferred_language: str = "ta",
        channel: str = "WHATSAPP",
    ) -> dict:
        primary_message = message_ta if preferred_language == "ta" else message_en
        try:
            if channel in ("WHATSAPP", "BOTH"):
                result = await self.send_whatsapp(phone, primary_message)
                return {**result, "sent_at": datetime.utcnow().isoformat()}
        except Exception as whatsapp_err:
            logger.error("WhatsApp failed for %s: %s — falling back to SMS", phone, whatsapp_err)
            if channel in ("SMS", "BOTH"):
                result = await self.send_sms(phone, primary_message)
                return {**result, "sent_at": datetime.utcnow().isoformat(), "fallback": True}
            raise
        return {"status": "skipped", "channel": channel}


messaging_service = MessagingService()
