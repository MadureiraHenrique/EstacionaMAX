package entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

public class Order implements BaseEntity {

    private Long id;
    private Vehicle vehicle;
    private LocalDateTime entryTime;
    private LocalDateTime departureTime;
    private Integer parkingSpace;
    private BigDecimal value;

    private Employee employee;

    public Order() {}

    public Order(Long id, Employee employee, BigDecimal value, Integer parkingSpace, LocalDateTime departureTime, Vehicle vehicle, LocalDateTime entryTime) {
        this.id = id;
        this.employee = employee;
        this.value = value;
        this.parkingSpace = parkingSpace;
        this.departureTime = departureTime;
        this.vehicle = vehicle;
        this.entryTime = entryTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Vehicle getCar() {
        return vehicle;
    }

    public void setCar(Vehicle vehicle) {
        this.vehicle = vehicle;
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
