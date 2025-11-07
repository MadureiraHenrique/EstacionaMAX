package entities;

import java.util.Objects;

public class Vehicle implements BaseEntity {

    private Long id;
    private String color;
    private String model;
    private String plate;
    private Client client;

    public Vehicle(){};

    public Vehicle(String model, String color, Long id, String plate, Client client) {
        this.model = model;
        this.color = color;
        this.id = id;
        this.plate = plate;
        this.client = client;
    }

    public Client getClient() {
        return client;
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
