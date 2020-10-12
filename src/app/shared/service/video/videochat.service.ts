import {connect, ConnectOptions, LocalTrack, Room} from 'twilio-video';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ReplaySubject, Observable} from 'rxjs';
import {TwilioToken} from '../../model/twilio-token';
import {environment} from '../../../../environments/environment';

const twilioUrl = environment.baseUrl + environment.twilioToken;

export interface NamedRoom {
    id: string;
    name: string;
    maxParticipants?: number;
    participantCount: number;
}


@Injectable()
export class VideoChatService {


    private options: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json'
        , responseType: 'text' as 'json'
    });

    constructor(private readonly http: HttpClient) {
    }


    getAuthToken(twilioRequest): Observable<TwilioToken> {
        return this.http.post<TwilioToken>(twilioUrl, twilioRequest, {headers: this.options});
    }
}
