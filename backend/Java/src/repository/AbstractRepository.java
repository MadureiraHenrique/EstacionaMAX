package repository;

import entities.BaseEntity;

import java.util.Map;
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
}
