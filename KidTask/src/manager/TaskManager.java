package manager;

import data.DataManager;
import model.*;
import java.util.List;

public class TaskManager {

	private List<User> users;
    private List<Task> tasks;
    private List<Wish> wishes;
    private User currentUser;
    
    
    public TaskManager() {
        this.users = DataManager.loadUsers();
        this.tasks = DataManager.loadTasks();
        this.wishes = DataManager.loadWishes();

        
        if (users.isEmpty()) {
            System.out.println("[Sistem] İlk kurulum: Varsayılan kullanıcılar (admin, ali) oluşturuluyor...");
            users.add(new User("admin", "123", UserRole.PARENT, 0));
            users.add(new User("ali", "123", UserRole.CHILD, 0));
            DataManager.saveUsers(users);
        }
    }
    
    public boolean login(String username, String password) {
        for (User u : users) {
            if (u.getUsername().equals(username) && u.getPassword().equals(password)) {
                currentUser = u;
                System.out.println(">>> GİRİŞ BAŞARILI: " + u.getUsername() + " (" + u.getRole() + ")");
                return true;
            }
        }
        System.out.println(">>> HATA: Kullanıcı adı veya şifre yanlış.");
        return false;
    }
    
    
    public void addTask(String title, String description, int points, TaskType type, String assignedTo) {
        if (currentUser == null || currentUser.getRole() == UserRole.CHILD) {
            System.out.println("HATA: Yetkisiz işlem.");
            return;
        }
        String id = String.valueOf(System.currentTimeMillis());
        
        tasks.add(new Task(id, title, description, points, type, assignedTo, 0));
        DataManager.saveTasks(tasks);
        System.out.println("Görev Eklendi: " + title);
    }
    
    
    public boolean completeTask(String taskId) {
        for (Task t : tasks) {
            if (t.getId().equals(taskId)) {
                // APPROVED görevler tekrar COMPLETED yapılamaz
                if (t.getStatus() == TaskStatus.APPROVED) {
                    System.out.println("HATA: Bu görev zaten onaylanmış, durumu değiştirilemez.");
                    return false;
                }
                // Sadece PENDING görevler COMPLETED yapılabilir
                if (t.getStatus() == TaskStatus.PENDING) {
                    t.setStatus(TaskStatus.COMPLETED);
                    DataManager.saveTasks(tasks);
                    System.out.println("Görev Tamamlandı İşaretlendi: " + t.getTitle());
                    return true;
                }
                System.out.println("HATA: Bu görev zaten tamamlanmış.");
                return false;
            }
        }
        System.out.println("HATA: Görev bulunamadı.");
        return false;
    }
    
    
    public void approveTask(String taskId, int rating) {
        if (currentUser == null || currentUser.getRole() == UserRole.CHILD) return;

        for (Task t : tasks) {
            if (t.getId().equals(taskId) && t.getStatus() == TaskStatus.COMPLETED) {
                t.setStatus(TaskStatus.APPROVED);
                t.setRating(rating);
                
                
                for(User u : users) {
                    if(u.getUsername().equals(t.getAssignedTo())) {
                        u.addPoints(t.getPoints());
                        System.out.println("ONAYLANDI! (Rating: " + rating + "/5) -> " + u.getUsername() + " +" + t.getPoints() + " Puan Kazandı.");
                        System.out.println("Yeni Toplam Puan: " + u.getTotalPoints());
                    }
                }
                DataManager.saveTasks(tasks);
                DataManager.saveUsers(users);
                return;
            }
        }
        System.out.println("HATA: Görev onaylanamadı.");
    }
    
    
    public String getFirstTaskId() {
        if(!tasks.isEmpty()) return tasks.get(0).getId();
        return "0";
    }
    
    public void printAllTasks() {
        System.out.println("\n--- GÖREV LİSTESİ ---");
        for(Task t : tasks) {
            System.out.println(t.getTitle() + " (" + t.getDescription() + ") - DURUM: " + t.getStatus());
        }
        System.out.println("---------------------\n");
    }
 // GUI İÇİN GEREKLİ GETTER METODLARI
    public List<Task> getAllTasks() {
        return tasks;
    }
    
    public User getCurrentUser() {
        return currentUser;
    }
    
    // WISH SİSTEMİ METODLARI
    public List<Wish> getAllWishes() {
        return wishes;
    }
    
    public List<Wish> getAvailableWishesForUser(String username) {
        User user = null;
        for (User u : users) {
            if (u.getUsername().equals(username)) {
                user = u;
                break;
            }
        }
        if (user == null) return new java.util.ArrayList<>();
        
        List<Wish> available = new java.util.ArrayList<>();
        for (Wish w : wishes) {
            if (w.getOwner().equals(username) && 
                w.getStatus() == WishStatus.PENDING && 
                user.getTotalPoints() >= w.getCost()) {
                available.add(w);
            }
        }
        return available;
    }
    
    public boolean purchaseWish(String wishName, String username) {
        if (currentUser == null || !currentUser.getUsername().equals(username)) {
            System.out.println("HATA: Yetkisiz işlem.");
            return false;
        }
        
        User user = null;
        for (User u : users) {
            if (u.getUsername().equals(username)) {
                user = u;
                break;
            }
        }
        if (user == null) return false;
        
        for (Wish w : wishes) {
            if (w.getName().equals(wishName) && 
                w.getOwner().equals(username) && 
                w.getStatus() == WishStatus.PENDING) {
                
                if (user.getTotalPoints() >= w.getCost()) {
                    user.setTotalPoints(user.getTotalPoints() - w.getCost());
                    w.setStatus(WishStatus.APPROVED);
                    DataManager.saveUsers(users);
                    DataManager.saveWishes(wishes);
                    System.out.println("Wish satın alındı: " + wishName + " (-" + w.getCost() + " puan)");
                    return true;
                } else {
                    System.out.println("Yetersiz puan! Gerekli: " + w.getCost() + ", Mevcut: " + user.getTotalPoints());
                    return false;
                }
            }
        }
        return false;
    }
}
