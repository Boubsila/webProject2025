import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'https://localhost:7128/api/Authentication/GetUsers';
  private userStatusUrl = 'https://localhost:7128/api/Authentication/UpdateUserStatus';
  private statisticsAllUsersUrl = 'https://localhost:7128/api/Statistics/statisticsAllUsers';
  private statisticsUserByRoleUrl = 'https://localhost:7128/api/Statistics/statisticsUsers/byRole?';
  private deleteUserUrl = 'https://localhost:7128/api/Authentication/DeleteUser';

  constructor(private http: HttpClient) { }

  deleteUSer(userId: number): Observable<any> {
    return this.http.delete(`${this.deleteUserUrl}/${userId}`);
  }

  getUsers(): any {
    return this.http.get<any[]>(this.userUrl);
  }

  getStatisticsUserByRole(role: string) {
    return this.http.get<number>(`${this.statisticsUserByRoleUrl}role=${role}`);
  }

  getStatisticsAllUsers() {
    return this.http.get<number>(this.statisticsAllUsersUrl);
  }

  changeStatus(userId: number): Observable<any> {
    return this.http.put(`${this.userStatusUrl}/${userId}`, null);
    this.getUsers();
  }


}
