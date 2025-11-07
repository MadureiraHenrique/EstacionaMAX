package repository;

import Adapter.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import entities.Report;

import java.io.*;
import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.Map;

public class ReportRepository extends AbstractRepository<Report> {
    private static ReportRepository instance;

    private final Gson gson;
    private final static String FILE_PATH = "report.json";
    private final Type typeToken;
    LocalDateTimeAdapter adapter;

    public ReportRepository() {
        super();

        this.gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, adapter)
                .setPrettyPrinting()
                .create();
        this.typeToken = new TypeToken<Map<Long, Report>>() {}.getType();

        loadFromFile();
    }

    public static ReportRepository getInstance() {
        if (instance == null) {
            synchronized (VehicleRepository.class) {
                if (instance == null) {
                    instance = new ReportRepository();
                }
            }
        }
        return instance;
    }

    @Override
    protected void loadFromFile() {
        try (Reader reader = new FileReader(FILE_PATH)) {
            Map<Long, Report> loadedMap = gson.fromJson(reader, typeToken);

            if (loadedMap != null) {
                database.putAll(loadedMap);
                Long maxId = loadedMap.keySet().stream().max(Long::compare).orElse(0L);
                nextId.set(maxId + 1);
            }
        } catch (IOException e) {
            System.out.println("Não foi possivel inicializar/Encontrar o arquivo " + FILE_PATH);
        }
    }

    @Override
    protected void persistMapToFile() {
        try (Writer writer = new FileWriter(FILE_PATH)) {
            gson.toJson(database, typeToken, writer);
        } catch (IOException e) {
            System.out.println("Não foi possivel inicializar/Encontrar o arquivo " + FILE_PATH);
        }
    }
}
