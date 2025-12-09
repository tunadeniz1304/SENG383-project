from __future__ import annotations
from typing import List

from time_slot import TimeSlot


class Section:
    def __init__(self, section_id: int, day: str, course: "Course") -> None:
        self.section_id = section_id
        self.day = day
        self.time_slots: List[TimeSlot] = []
        self.course = course

    def get_section_id(self) -> int:
        return self.section_id

    def get_day(self) -> str:
        return self.day

    def get_time_slots(self) -> List[TimeSlot]:
        return self.time_slots

    def get_course(self) -> "Course":
        return self.course

    def add_time_slot(self, start_time: str, end_time: str, slot_type: str = "Lecture") -> None:
        self.time_slots.append(TimeSlot(start_time, end_time, slot_type))
