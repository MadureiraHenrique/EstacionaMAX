package entities;

import java.math.BigDecimal;

public class Parking implements BaseEntity {
    private static Parking instance;

    private Long id;
    private String nome;
    private BigDecimal valor;

    private Parking() {
        this.nome = "Estacionamento";
        this.valor = BigDecimal.valueOf(10);
    }

    public static Parking getInstance() {
        if (instance == null) {
            synchronized (Parking.class) {
                if (instance == null) {
                    instance = new Parking();
                }
            }
        }
        return instance;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long Id) {
        this.id = Id;
    }
}
