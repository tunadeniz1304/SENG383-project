class TimeSlot:
    def __init__(self, start_time: str, end_time: str, slot_type: str = "Lecture") -> None:
        self.start_time = start_time
        self.end_time = end_time
        self.slot_type = slot_type  # "Lecture" or "Lab"

    def get_start_time(self) -> str:
        return self.start_time

    def get_end_time(self) -> str:
        return self.end_time

    def get_type(self) -> str:
        return self.slot_type

    def is_lab(self) -> bool:
        return self.slot_type == "Lab"
