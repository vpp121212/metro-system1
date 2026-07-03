from datetime import date, time


def parse_date(v: str | None) -> date | None:
    if not v:
        return None
    try:
        return date.fromisoformat(v)
    except (ValueError, TypeError):
        return None


def parse_time(v: str | None) -> time | None:
    if not v:
        return None
    try:
        parts = v.split(":")
        return time(int(parts[0]), int(parts[1]), int(parts[2]) if len(parts) > 2 else 0)
    except (ValueError, TypeError, IndexError):
        return None
