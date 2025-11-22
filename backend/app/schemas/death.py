"""Player death schemas."""

from datetime import datetime

from pydantic import BaseModel


class DeathResponse(BaseModel):
    """Schema for death response."""

    id: int
    player_id: int
    player_name: str | None = None
    time: int
    level: int
    killed_by: str
    is_player: int
    mostdamage_by: str | None = None
    mostdamage_is_player: int | None = None

    model_config = {"from_attributes": True}

    @property
    def time_formatted(self) -> str:
        """Return formatted time."""
        return datetime.fromtimestamp(self.time).strftime("%Y-%m-%d %H:%M:%S")

    @property
    def time_ago(self) -> str:
        """Return human-readable time ago."""
        now = datetime.now()
        death_time = datetime.fromtimestamp(self.time)
        delta = now - death_time

        if delta.days > 0:
            return f"{delta.days} day{'s' if delta.days != 1 else ''} ago"
        elif delta.seconds >= 3600:
            hours = delta.seconds // 3600
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        elif delta.seconds >= 60:
            minutes = delta.seconds // 60
            return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
        else:
            return "Just now"
