import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {
  LocalParticipant,
  RemoteParticipant,
  RemoteTrack,
  RemoteAudioTrack,
  RemoteVideoTrack,
  RemoteTrackPublication,
  LocalAudioTrackPublication,
  LocalVideoTrackPublication
} from 'twilio-video';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit , AfterViewInit{

  @ViewChild('preview', {static: false}) preview: ElementRef;

  isPreviewing = false;
  localInitial: string;
  host: string;
  sid: string;
  part: any;
  currentIdentity;

  @Input('participant')
  set participant(participant: any) {
    this.part = participant;
    console.log(participant);
  }
  @Input('isHost')
  set isHost(host: any) {
    this.host = host;
  }


  @Input('localParticipant')
  set localParticipant(localParticipant: any) {
    this.currentIdentity = localParticipant.identity;
  }

  @Output('muted') muted = new EventEmitter<boolean>();
  @Input('micOn') micOn: boolean;


  private isAttachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
    return !!track &&
        ((track as RemoteAudioTrack).attach !== undefined ||
            (track as RemoteVideoTrack).attach !== undefined);
  }

  private isDetachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
    return !!track &&
        ((track as RemoteAudioTrack).detach !== undefined ||
            (track as RemoteVideoTrack).detach !== undefined);
  }

  private isLocal(track: any): track is LocalAudioTrackPublication | LocalVideoTrackPublication {
    return !!track;
  }


  constructor(private readonly renderer: Renderer2) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    console.log(this.preview);
    if (!!this.part) {
      let local;
      this.part.videoTracks.forEach( track => {
        local = this.isLocal(track.track);
      });
      if (local) {
        this.part.videoTracks.forEach( track => {
          this.attachLocalTrack(track);
        });
      } else {
        this.registerEvents(this.part);
      }
    }
  }

  private registerEvents(participant: RemoteParticipant) {
    this.localInitial = this.participant.identity.substring(0, 1);

    participant.tracks.forEach(publication => this.subscribe(publication));
    participant.on('trackPublished', publication => this.subscribe(publication));
    participant.on('trackUnpublished',
        publication => {
          if (publication && publication.track) {
            this.detachRemoteTrack(publication.track);
          }
        });
  }

  private subscribe(publication: RemoteTrackPublication | any) {
    if (publication && publication.on) {
      publication.on('subscribed', track => this.attachRemoteTrack(track));
      publication.on('unsubscribed', track => this.detachRemoteTrack(track));
    }
  }

  private attachRemoteTrack(track: RemoteTrack) {
    if (this.isAttachable(track)) {
      this.isPreviewing = true;
      const element = track.attach();
      this.renderer.data.id = track.sid;
      this.renderer.setStyle(element, 'width', '100%');
      this.renderer.appendChild(this.preview.nativeElement, element);
    }
  }

  private detachRemoteTrack(track: RemoteTrack) {
    if (this.isDetachable(track)) {
      track.detach().forEach(el => el.remove());
      this.isPreviewing = false;
    }
  }

  private attachLocalTrack(track: any) {
    if (this.isAttachable(track.track)) {
      this.isPreviewing = true;
      const element = track.track.attach();
      this.renderer.data.id = track.sid ? track.sid : track.trackSid;
      this.renderer.setStyle(element, 'width', '100%');
      console.log(this.preview);
      this.renderer.appendChild(this.preview.nativeElement, element);
    }
  }

  mute() {
    this.micOn = !this.micOn;
    this.muted.emit(this.micOn);
  }
}
