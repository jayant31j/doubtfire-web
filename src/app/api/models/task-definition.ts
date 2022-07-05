import { Entity } from 'ngx-entity-service';
import { AppInjector } from 'src/app/app-injector';
import { DoubtfireConstants } from 'src/app/config/constants/doubtfire-constants';
import { Grade, GroupSet, TutorialStream, Unit, User } from './doubtfire-model';

export class TaskDefinition extends Entity {

  id: number;
  seq: number;
  abbreviation: string;
  name: string;
  description: string;
  weighting: number;
  targetGrade: number;
  targetDate: Date;
  dueDate: Date;
  startDate: Date;
  uploadRequirements: {key: string, name: string, type: string}[];
  tutorialStream: TutorialStream;
  plagiarismChecks: {key: string, type: string, pattern: string}[];
  plagiarismReportUrl: string;
  plagiarismWarnPct: number;
  restrictStatusUpdates: boolean;
  // groupSetId: number;
  groupSet: GroupSet = null;
  hasTaskSheet: boolean;
  hasTaskResources: boolean;
  hasTaskAssessmentResources: boolean;
  isGraded: boolean;
  maxQualityPts: number;
  overseerImageId: number;
  assessmentEnabled: boolean;

  readonly unit: Unit;

  constructor(unit: Unit) {
    super();
    this.unit = unit;
  }

  public localDueDate(): Date {
    return this.targetDate;
  }

  public localDeadlineDate(): Date {
    return this.dueDate;
  }

  /**
   * The final deadline for task submission.
   *
   * @returns the final due date
   */
  public finalDeadlineDate(): Date {
    return this.dueDate; // now in due date
  }

  public isGroupTask(): boolean {
    return this.groupSet !== null;
  }

  public getTaskPDFUrl(asAttachment: boolean = false): string {
    const constants = AppInjector.get(DoubtfireConstants);
    return `${constants.API_URL}/units/${this.unit.id}/task_definitions/${this.id}/task_pdf.json${ asAttachment ? "?as_attachment=true" : ""}`;
  }

  public getTaskResourcesUrl(asAttachment: boolean = false) {
    const constants = AppInjector.get(DoubtfireConstants);
    return `${constants.API_URL}/units/${this.unit.id}/task_definitions/${this.id}/task_resources.json${ asAttachment ? "?as_attachment=true" : ""}`;
  }

  public get targetGradeText(): string {
    return Grade.GRADES[this.targetGrade];
  }

  public hasPlagiarismCheck(): boolean {
    return this.plagiarismChecks.length > 0;
  }

  public get taskSheetUploadUrl(): string {
    return `${AppInjector.get(DoubtfireConstants).API_URL}/units/${this.unit.id}/task_definitions/${this.id}/task_sheet`;
  }

  public get taskResourcesUploadUrl(): string {
    return `${AppInjector.get(DoubtfireConstants).API_URL}/units/${this.unit.id}/task_definitions/${this.id}/task_resources`;
  }

  public get taskAssessmentResourcesUploadUrl(): string {
    return `${AppInjector.get(DoubtfireConstants).API_URL}/units/${this.unit.id}/task_definitions/${this.id}/task_assessment_resources`;
  }


}