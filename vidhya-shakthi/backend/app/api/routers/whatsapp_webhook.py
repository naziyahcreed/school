from fastapi import APIRouter, Request, Query, HTTPException
from app.core.config import get_settings

router = APIRouter()
settings = get_settings()


@router.get("/webhook")
async def verify_webhook(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_verify_token: str = Query(None, alias="hub.verify_token"),
    hub_challenge: str = Query(None, alias="hub.challenge"),
):
    """Meta WhatsApp Business API webhook verification handshake."""
    if hub_mode == "subscribe" and hub_verify_token == settings.WHATSAPP_VERIFY_TOKEN:
        return int(hub_challenge)
    raise HTTPException(status_code=403, detail="Verification failed")


@router.post("/webhook")
async def receive_webhook(request: Request):
    """Receive WhatsApp delivery status callbacks."""
    payload = await request.json()
    entries = payload.get("entry", [])
    for entry in entries:
        for change in entry.get("changes", []):
            value = change.get("value", {})
            statuses = value.get("statuses", [])
            for status in statuses:
                message_id = status.get("id")
                delivery_status = status.get("status")
                # Update parent_alerts.delivery_status via background task in production
                print(f"WhatsApp status update: {message_id} -> {delivery_status}")
    return {"status": "ok"}
