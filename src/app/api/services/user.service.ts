import { UnitRole, UnitService, User } from 'src/app/api/models/doubtfire-model';
import { CachedEntityService } from 'ngx-entity-service';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import API_URL from 'src/app/config/constants/apiURL';
import { AppInjector } from 'src/app/app-injector';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';

@Injectable()
export class UserService extends CachedEntityService<User> implements OnInit {
  protected readonly endpointFormat = 'users/:id:';
  private readonly tutorEndpointFormat = "/users/tutors";

  public readonly csvURL: string;

  constructor(
    httpClient: HttpClient
  ) {
    super(httpClient, API_URL);

    this.csvURL = API_URL + 'csv/users';

    this.mapping.addKeys(
      'id',
      'firstName',
      'lastName',
      'optInToResearch',
      'studentId',
      'email',
      'username',
      'nickname',
      'systemRole',
      'receiveTaskNotifications',
      'receivePortfolioNotifications',
      'receiveFeedbackNotifications',
      'hasRunFirstTimeSetup',
    );

    this._currentUser = this.anonymousUser;

    this.mapping.mapAllKeysToJsonExcept('id');
  }

  ngOnInit(): void {
    AppInjector.get(AuthenticationService).checkUserCookie();
  }

  public createInstanceFrom(json: any, other?: any): User {
    return new User();
  }

  public newEmptyUser(): User {
    return new User();
  }

  public get anonymousUser(): User {
    const result = new User();
    result.firstName = 'Anonymous';
    result.lastName = 'User';
    result.nickname = 'anon';
    return result;
  }

  private _currentUser: User;
  public get currentUser(): User {
    return this._currentUser;
  }

  public set currentUser(user: User) {
    this._currentUser = user;
  }

  // Specific to the User entity
  public save(user: User) {
    if (user === this.currentUser) {
      AppInjector.get(AuthenticationService).saveCurrentUser();
    }
    else {
      console.log("implement save other users...?");
    }
  }

  public getTutors(): Observable<User[]> {
    return this.query(undefined, { endpointFormat: this.tutorEndpointFormat});
  }

  public adminRoleFor(unitId: number, user: User): UnitRole {
    const result = new UnitRole();
    result.role = "Admin";
    result.user = user;

    const unitService = AppInjector.get(UnitService);
    result.unit = unitService.cache.getOrCreate(unitId, unitService, { id: unitId });

    return result;
  }

}