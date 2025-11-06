package repository;

import entities.BaseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

public abstract class AbstractRepository<T extends BaseEntity> {
    protected final Map<Long, T> database = new ConcurrentHashMap<>();

    protected AtomicLong nextId = new AtomicLong(1);

    public AbstractRepository() {

        loadFromFile();
    }

    protected abstract void loadFromFile();

    protected abstract void persistMapToFile();

    public synchronized T save(T entity) {
        entity.setId(nextId.getAndIncrement());
        database.put(entity.getId(), entity);
        persistMapToFile();
        return entity;
    }

    public synchronized T update(T entity) {
        if (entity.getId() == null || !database.containsKey(entity.getId())) {
            throw new IllegalArgumentException("A entidade não existe, não é possivel atualizar");
        }
        database.put(entity.getId(), entity);
        persistMapToFile();
        return entity;
    }

    public synchronized T deleteById(Long id) {
        database.remove(id);
        persistMapToFile();
    }

    public Optional<T> findById(Long id) {
        return Optional.ofNullable(database.get(id));
    }

    public List<T> findAll() {
        return new ArrayList<>(database.values());
    }
}
