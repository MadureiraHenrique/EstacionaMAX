package repository;

import Adapter.LocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import entities.Order;
import jakarta.servlet.ServletContext;

import java.io.*;
import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class OrderRepository extends AbstractRepository<Order> {
    private static OrderRepository instance;

    private final Gson gson;
    private final Type typeToken;
    LocalDateTimeAdapter adapter;

    public OrderRepository(ServletContext context) {
        super(context.getRealPath("/WEB-INF/pedidos.json"));

        this.adapter = new LocalDateTimeAdapter();
        this.gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, adapter)
                .setPrettyPrinting()
                .create();
        this.typeToken = new TypeToken<Map<Long, Order>>() {}.getType();

        loadFromFile();
    }

    public static OrderRepository getInstance(ServletContext servletContext) {
        if (instance == null) {
            synchronized (UserRepository.class) {
                if (instance == null) {
                    instance = new OrderRepository(servletContext);
                }
            }
        }
        return instance;
    }

    @Override
    protected void loadFromFile() {
        try (Reader reader = new FileReader(String.valueOf(fullPath))) {
            Map<Long, Order> loadedMap = gson.fromJson(reader, typeToken);

            if (loadedMap != null) {
                database.putAll(loadedMap);
                long maxId = loadedMap.keySet().stream().max(Long::compare).orElse(0L);
                nextId.set(maxId + 1);
            }
        } catch (IOException e) {
            System.out.println("Arquivo não encontrado em: " + fullPath);
        }
    }

    @Override
    protected void persistMapToFile() {
        try (Writer writer = new FileWriter(String.valueOf(fullPath))) {
            gson.toJson(database, typeToken, writer);
        } catch (IOException e) {
            System.out.println("Arquivo não encontrado em: " + fullPath);
        }
    }

    public List<Order> findAllByFuncionarioId(Long id) {
        return database.values()
                .stream()
                .filter(order -> order.getEmployee().getId().equals(id))
                .toList();
    }

    public List<Order> findAllByClienteId(Long id) {
        return database.values()
                .stream()
                .filter(order -> order.getClient().getId().equals(id))
                .toList();
    }

    public List<Order> findAllOpenPedidos() {
        return database.values()
                .stream()
                .filter(order -> order.getDepartureTime() == null)
                .toList();
    }
}
