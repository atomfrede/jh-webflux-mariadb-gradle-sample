package tech.jhipster.sample.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Operation.
 */
@Table("operation")
public class Operation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    @NotNull(message = "must not be null")
    @Column("date")
    private Instant date;

    @Column("description")
    private String description;

    @NotNull(message = "must not be null")
    @Column("amount")
    private BigDecimal amount;

    @JsonIgnoreProperties(value = { "user", "operations" }, allowSetters = true)
    @Transient
    private BankAccount bankAccount;

    @Column("bank_account_id")
    private Long bankAccountId;

    @JsonIgnoreProperties(value = { "operations" }, allowSetters = true)
    @Transient
    private Set<Label> labels = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Operation id(Long id) {
        this.id = id;
        return this;
    }

    public Instant getDate() {
        return this.date;
    }

    public Operation date(Instant date) {
        this.date = date;
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public String getDescription() {
        return this.description;
    }

    public Operation description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return this.amount;
    }

    public Operation amount(BigDecimal amount) {
        this.amount = amount != null ? amount.stripTrailingZeros() : null;
        return this;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount != null ? amount.stripTrailingZeros() : null;
    }

    public BankAccount getBankAccount() {
        return this.bankAccount;
    }

    public Operation bankAccount(BankAccount bankAccount) {
        this.setBankAccount(bankAccount);
        this.bankAccountId = bankAccount != null ? bankAccount.getId() : null;
        return this;
    }

    public void setBankAccount(BankAccount bankAccount) {
        this.bankAccount = bankAccount;
        this.bankAccountId = bankAccount != null ? bankAccount.getId() : null;
    }

    public Long getBankAccountId() {
        return this.bankAccountId;
    }

    public void setBankAccountId(Long bankAccount) {
        this.bankAccountId = bankAccount;
    }

    public Set<Label> getLabels() {
        return this.labels;
    }

    public Operation labels(Set<Label> labels) {
        this.setLabels(labels);
        return this;
    }

    public Operation addLabel(Label label) {
        this.labels.add(label);
        label.getOperations().add(this);
        return this;
    }

    public Operation removeLabel(Label label) {
        this.labels.remove(label);
        label.getOperations().remove(this);
        return this;
    }

    public void setLabels(Set<Label> labels) {
        this.labels = labels;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Operation)) {
            return false;
        }
        return id != null && id.equals(((Operation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Operation{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", description='" + getDescription() + "'" +
            ", amount=" + getAmount() +
            "}";
    }
}
