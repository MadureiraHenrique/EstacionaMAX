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
import java.util.ArrayList;
import java.util.HashMap;
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
            Type type = new TypeToken<Map<String, List<Order>>>() {}.getType();

            Map<String, List<Order>> wrapper = gson.fromJson(reader, type);

            if (wrapper != null) {
                List<Order> loadedList = wrapper.get("pedidos");

                if (loadedList != null) {
                    database.clear();

                    long maxId = 0;

                    for (Order p : loadedList) {
                        database.put(p.getId(), p);
                        if (p.getId() > maxId) {
                            maxId = p.getId();
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
        try (Writer writer = new FileWriter(String.valueOf(fullPath))) {
            Map<String, Object> wrapper = new HashMap<>();
            List<Order> pedidos = new ArrayList<>(database.values());
            wrapper.put("pedidos", pedidos);
            gson.toJson(wrapper, writer);
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
