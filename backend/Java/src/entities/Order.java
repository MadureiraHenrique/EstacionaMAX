package entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

public class Order implements BaseEntity {

    private Long id;
    private Client client;
    private Vehicle vehicle;
    private LocalDateTime entryTime;
    private LocalDateTime departureTime;
    private Integer parkingSpace;
    private BigDecimal value;

    private Employee employee;

    public Order() {}

    public Order(Long id, Employee employee, BigDecimal value, Integer parkingSpace, Vehicle vehicle, LocalDateTime entryTime) {
        this.id = id;
        this.employee = employee;
        this.value = value;
        this.parkingSpace = parkingSpace;
        this.entryTime = entryTime;
        this.vehicle = vehicle;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    public Integer getParkingSpace() {
        return parkingSpace;
    }

    public void setParkingSpace(Integer parkingSpace) {
        this.parkingSpace = parkingSpace;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Order order = (Order) o;
        return Objects.equals(id, order.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
