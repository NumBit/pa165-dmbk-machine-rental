package cz.muni.fi.pa165.dmbk.machinerental.dao.revision.model;

import cz.muni.fi.pa165.dmbk.machinerental.dao.machine.Machine;
import lombok.*;

import javax.persistence.*;
import java.sql.Time;
import java.time.LocalDate;


/**
 * Class representing Machines' revision
 * @author Lukas Krekan
 *
 **/

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
@Table(name = "REVISION")
public class Revision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "revision_date")
    private LocalDate revisionDate;

    @Column (nullable = false, name = "revision_time")
    private Time revisionTime;

    @ManyToOne
    @JoinColumn(name = "machine_id",nullable = false)
    private Machine machine;

    private String note;

}
