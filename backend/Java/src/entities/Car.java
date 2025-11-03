package entities;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Car {

    private Long id;
    private String color;
    private String model;
    private String plate;

    private List<Order> orders = new ArrayList<>();

    public Car(){};

    public Car(String model, String color, Long id, String plate) {
        this.model = model;
        this.color = color;
        this.id = id;
        this.plate = plate;
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

    public List<Order> getOrders() {
        return orders;
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
        Car car = (Car) o;
        return Objects.equals(plate, car.plate);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(plate);
    }
}
