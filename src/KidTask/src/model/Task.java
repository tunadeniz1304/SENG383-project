package model;
import java.time.LocalDate;

public class Task {
	private String id;
	private String title;
	private String description;
    private int points;
    private TaskStatus status;
    private TaskType type;
    private String assignedTo;
    private LocalDate dueDate;
    private int rating;
    
    public Task(String id, String title, String description, int points, TaskType type, String assignedTo, int rating) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.points = points;
        this.type = type;
        this.assignedTo = assignedTo;
        this.status = TaskStatus.PENDING;
        this.dueDate = LocalDate.now();
        this.rating = rating;
    }
    
    public String toCSV() {
        return id + "," + title + "," + description + "," + points + "," + status + "," + type + "," + assignedTo + "," + rating;
    }

    public static Task fromCSV(String line) {
        String[] parts = line.split(",");
        if (parts.length < 8) return null;
        
        TaskType type = TaskType.valueOf(parts[5]);
        Task t = new Task(parts[0], parts[1], parts[2], Integer.parseInt(parts[3]), type, parts[6], Integer.parseInt(parts[7]));
        t.setStatus(TaskStatus.valueOf(parts[4]));
        return t;
    }


    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public int getPoints() { return points; }
    public TaskStatus getStatus() { return status; }
    public TaskType getType() { return type; }
    public String getAssignedTo() { return assignedTo; }
    public int getRating() { return rating; }
    
    public void setStatus(TaskStatus status) { this.status = status; }
    public void setRating(int rating) { this.rating = rating; }
}
