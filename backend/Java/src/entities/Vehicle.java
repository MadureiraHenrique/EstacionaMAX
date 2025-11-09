package entities;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class Vehicle implements BaseEntity {

    private Long id;
    private String color;
    private String model;
    private String plate;
    private Set<Long> clienteIds = new HashSet<>();

    public Vehicle(){};

    public Vehicle(String model, String color, Long id, String plate, Client client) {
        this.model = model;
        this.color = color;
        this.id = id;
        this.plate = plate;
    }

    public Set<Long> getClienteIds() {
        return clienteIds;
    }

    public void setClienteIds(Set<Long> clienteIds) {
        this.clienteIds = clienteIds;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getPlate() {
        return plate;
    }

    public void setPlate(String plate) {
        this.plate = plate;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Vehicle vehicle = (Vehicle) o;
        return Objects.equals(plate, vehicle.plate);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(plate);
    }
}
