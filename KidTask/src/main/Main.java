package main;

import manager.TaskManager;
import model.TaskType;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== KIDTASK SİMÜLASYONU BAŞLATILIYOR ===");
        
        TaskManager app = new TaskManager();

        
        System.out.println("\n--- ADIM 1: EBEVEYN GİRİŞİ ---");
        if(app.login("admin", "123")) {
           
            app.addTask("Odamı Topla", "Tüm oyuncakları kutuya koy", 20, TaskType.DAILY, "ali");
            app.addTask("Bahçeyi Sula", "Çiçekleri sula", 50, TaskType.WEEKLY, "ali");
        }
        
        app.printAllTasks();

       
        System.out.println("\n--- ADIM 2: ÇOCUK GİRİŞİ ---");
        if(app.login("ali", "123")) {
            String id = app.getFirstTaskId(); 
            app.completeTask(id);
        }

       
        System.out.println("\n--- ADIM 3: EBEVEYN ONAYI ---");
        if(app.login("admin", "123")) {
            String id = app.getFirstTaskId();
           
            app.approveTask(id, 5);
        }
        
        System.out.println("\n=== SİMÜLASYON BİTTİ ===");
        System.out.println("Lütfen projenize sağ tıklayıp 'Refresh' yapın.");
        System.out.println("users.txt dosyasında Ali'nin puanının arttığını göreceksiniz.");
    }
}