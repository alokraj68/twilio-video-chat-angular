import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {Rooms} from '../../model/rooms';
import {RoomData} from '../../model/room-data';


const url = environment.baseUrl;
const roomUrl = url + environment.rooms;
const myEventUrl = url + environment.myEvents;
const allMyRooms = url + environment.allUserEvents;

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) {}

  private httpOptions: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  // get rooms
  getRooms(): Observable<RoomData[]> {
    return this.http.get<RoomData[]>(roomUrl);
  }

  // get rooms
  sendRoomDetails(room: Rooms): Observable<Rooms> {
    return this.http.post<Rooms>(roomUrl, room, {headers: this.httpOptions});
  }


  // get room by id
  getRoomById(id): Observable<Rooms> {
    return this.http.get<Rooms>(`${roomUrl}/${id}`);
  }

  // get user room
  getRoomByUser(): Observable<RoomData[]> {
    return this.http.get<RoomData[]>(`${myEventUrl}`);
  }

  // get all user rooms
  getAllRoomByUser(): Observable<RoomData[]> {
    return this.http.get<RoomData[]>(`${allMyRooms}`);
  }
}
