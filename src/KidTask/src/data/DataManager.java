package data;

import model.*;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class DataManager {
	//User,Task,Wish 
	public static List<User> loadUsers() {
        List<User> list = new ArrayList<>();
        read("users.txt", list, User::fromCSV);
        return list;
    }
	
	public static void saveUsers(List<User> users) {
        write("users.txt", users, User::toCSV);
    }
	
	public static List<Task> loadTasks() {
        List<Task> list = new ArrayList<>();
        read("tasks.txt", list, Task::fromCSV);
        return list;
    }
    public static void saveTasks(List<Task> tasks) {
        write("tasks.txt", tasks, Task::toCSV);
    }
    
    public static List<Wish> loadWishes() {
        List<Wish> list = new ArrayList<>();
        read("wishes.txt", list, Wish::fromCSV);
        return list;
    }
    public static void saveWishes(List<Wish> wishes) {
        write("wishes.txt", wishes, Wish::toCSV);
    }

    interface Parser<T> { T parse(String line); }
    interface Serializer<T> { String serialize(T item); }

    private static <T> void read(String filename, List<T> list, Parser<T> parser) {
        File file = new File(filename);
        if (!file.exists()) return;

        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null) {
                if (!line.trim().isEmpty()) {
                    try {
                        T item = parser.parse(line);
                        if (item != null) list.add(item);
                    } catch (Exception e) {
                        System.err.println("HATA: Dosya formatı bozuk (" + filename + "): " + line);
                    }
                }
            }
        } catch (IOException e) { e.printStackTrace(); }
    }

    private static <T> void write(String filename, List<T> list, Serializer<T> serializer) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(filename))) {
            for (T item : list) {
                bw.write(serializer.serialize(item));
                bw.newLine();
            }
        } catch (IOException e) { e.printStackTrace(); }
    }
}
