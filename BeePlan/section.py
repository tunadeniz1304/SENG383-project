from __future__ import annotations

from typing import List


class Section:
    def __init__(self, section_id: int, day: str, course: "Course") -> None:
        pass

    def get_section_id(self) -> int:
        pass

    def get_day(self) -> str:
        pass

    def get_time_slots(self) -> List["TimeSlot"]:
        pass

    def get_course(self) -> "Course":
        pass

    def add_time_slot(self, start_time: str, end_time: str) -> None:
        pass


