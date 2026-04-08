import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

// Interface décrivant la structure d'une offre d'emploi
// POURQUOI: Type @Input() jobOffer pour bénéficier de l'autocomplétion
interface JobOffer {
  title: string;
  department: string;
  description: string;
  skills: string[];
  remote: boolean;
  deadline: string;
}

@Component({
  selector: 'app-job-offer-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './job-offer-form.component.html'
})
export class JobOfferFormComponent implements OnInit {
  // Optionnel — absent en mode création, fourni en mode édition
  @Input() jobOffer?: JobOffer;

  jobOfferForm!: FormGroup;

  // Liste fixe des départements correspondant aux valeurs acceptées par le backend
  readonly departments = [
    'TECH', 'MARKETING', 'FINANCE', 'HR'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Récupération des compétences existantes avant la création du formulaire
    // POURQUOI: En mode création, le tableau est vide
    const initialSkills = this.jobOffer?.skills ?? [];

    this.jobOfferForm = this.fb.group({
      title: [
        this.jobOffer?.title ?? '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(120)
        ]
      ],
      department: [
        this.jobOffer?.department ?? '',
        Validators.required
      ],
      description: [
        this.jobOffer?.description ?? '',
        Validators.maxLength(1000)
      ],
      // Initialisation du FormArray depuis les données existantes
      // POURQUOI: En mode création, fb.array([]) produit un FormArray vide ;
      // en mode édition, chaque compétence existante devient un FormControl pré-rempli
      skills: this.fb.array(
        initialSkills.map(skill =>
          this.fb.control(skill, Validators.required)
        )
      ),
      remote: [this.jobOffer?.remote ?? false],
      deadline: [this.jobOffer?.deadline ?? '']
    });
  }

  // Accesseurs pour alléger le template
  get title() {
    return this.jobOfferForm.get('title');
  }
  get department() {
    return this.jobOfferForm.get('department');
  }
  get description() {
    return this.jobOfferForm.get('description');
  }
  get skills(): FormArray {
    return this.jobOfferForm.get('skills') as FormArray;
  }
  get remote() {
    return this.jobOfferForm.get('remote');
  }
  get deadline() {
    return this.jobOfferForm.get('deadline');
  }

  addSkill(): void {
    this.skills.push(
      this.fb.control('', Validators.required)
    );
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  // Propriété calculée combinant validité du formulaire ET présence d'au moins une compétence
  // POURQUOI: Un FormArray vide ne rend pas le formulaire invalide par lui-même
  get canSubmit(): boolean {
    return this.jobOfferForm.valid
      && this.skills.length > 0;
  }

  onSubmit(): void {
    if (this.canSubmit) {
      console.log(this.jobOfferForm.value);
    }
  }
}
