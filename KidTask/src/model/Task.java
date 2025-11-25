package model;
import java.time.LocalDate;

public class Task {
	private int id;
	private String title;
	private String description;
    private int points;
    private TaskStatus status;
    private TaskType type;
    private String assignedTo;
    private LocalDate dueDate;
    private int rating;
    
    public Task(int id, String title, int points, TaskType type, String assignedTo,int rating) {
        this.id = id;
        this.title = title;
        this.points = points;
        this.type = type;
        this.assignedTo = assignedTo;
        this.status = TaskStatus.PENDING;
        this.dueDate = LocalDate.now();
        this.rating = rating;
    }
}
