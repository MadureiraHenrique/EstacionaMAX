package repository;

import Adapter.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import entities.Vehicle;
import jakarta.servlet.ServletContext;

import java.io.*;
import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

public class VehicleRepository extends AbstractRepository<Vehicle> {
    private static VehicleRepository instance;

    private final Gson gson;
    private final Type typeToken;
    LocalDateTimeAdapter adapter;

    public VehicleRepository(ServletContext servletContext) {
        super(servletContext.getRealPath("/WEB-INF/veiculos.json"));

        this.adapter = new LocalDateTimeAdapter();
        this.gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, adapter)
                .setPrettyPrinting()
                .create();
        this.typeToken = new TypeToken<Map<Long, Vehicle>>() {}.getType();

        loadFromFile();
    }

    public static VehicleRepository getInstance(ServletContext servletContext) {
        if (instance == null) {
            synchronized (VehicleRepository.class) {
                if (instance == null) {
                    instance = new VehicleRepository(servletContext);
                }
            }
        }
        return instance;
    }

    @Override
    protected void loadFromFile() {
        try (Reader reader = new FileReader(fullPath)) {
            Type type = new TypeToken<Map<String, List<Vehicle>>>() {}.getType();

            Map<String, List<Vehicle>> wrapper = gson.fromJson(reader, type);

            if (wrapper != null) {
                List<Vehicle> loadedList = wrapper.get("veiculos");

                if (loadedList != null) {
                    database.clear();

                    long maxId = 0;

                    for (Vehicle v : loadedList) {
                        database.put(v.getId(), v);
                        if (v.getId() > maxId) {
                            maxId = v.getId();
                        }

                    }

                    nextId.set(maxId + 1);
                }
            }
        } catch (IOException e) {
            System.out.println("Arquivo não encontrado em: " + fullPath);
        }
    }

    @Override
    protected void persistMapToFile() {
        try (Writer writer = new FileWriter(fullPath)) {
            Map<String, Object> wrapper = new HashMap<>();
            List<Vehicle> veiculos = new ArrayList<>(database.values());
            wrapper.put("veiculos", veiculos);
            gson.toJson(wrapper, writer);
        } catch (IOException e) {
            System.out.println("Arquivo não encontrado em: " + fullPath);
        }
    }

    public Optional<Vehicle> findByPlaca(String placa) {
        return database.values()
                .stream()
                .filter(vehicle -> vehicle.getPlate().equals(placa))
                .findFirst();
    }
}
