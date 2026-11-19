package br.com.nexuserp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "customers")
public class Customer extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 140)
    private String name;

    @Column(nullable = false, unique = true, length = 180)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(unique = true, length = 30)
    private String document;

    @Column(length = 300)
    private String address;

    public Customer() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getDocument() { return document; }
    public void setDocument(String document) { this.document = document; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
