import { Component, Input } from '@angular/core';
import { CandidateScoringService } from '../../services/candidate-scoring.service';

@Component({
  selector: 'app-match-score',
  templateUrl: './match-score.component.html',
  styleUrls: ['./match-score.component.scss']
})
export class MatchScoreComponent {
  @Input() score!: number;
  @Input() breakdown!: {
    skillsMatch: number;
    experienceMatch: number;
    roleMatch: number;
    locationMatch: number;
  };
  @Input() explanations: string[] = [];

  constructor(public scoringService: CandidateScoringService) {}

  get scoreColor(): string {
    return this.scoringService.getScoreColor(this.score);
  }

  get scoreDescription(): string {
    return this.scoringService.getScoreDescription(this.score);
  }

  get tooltipContent(): string {
    const breakdownText = `
Skills Match: ${this.breakdown.skillsMatch}%
Experience Match: ${this.breakdown.experienceMatch}%
Role Match: ${this.breakdown.roleMatch}%
Location Match: ${this.breakdown.locationMatch}%

Key Factors:
${this.explanations.join('\n')}
    `.trim();

    return breakdownText;
  }
} 