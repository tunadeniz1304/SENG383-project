class TimeSlot:
    def __init__(self, start_time: str, end_time: str) -> None:
        self.start_time = start_time
        self.end_time = end_time

    def get_start_time(self) -> str:
        return self.start_time

    def get_end_time(self) -> str:
        return self.end_time
