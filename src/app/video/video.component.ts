import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener, Inject,
    Input,
    OnInit,
    QueryList,
    Renderer2,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {
    connect,
    Room,
    LocalParticipant,
    RemoteParticipant,
    Participant,
    RemoteTrack,
    LocalTrack,
    RemoteTrackPublication,
    RemoteAudioTrack,
    RemoteVideoTrack,
    ConnectOptions,
    createLocalTracks,
    isSupported,
    LocalVideoTrack,
    LocalDataTrack
} from 'twilio-video';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DialogInviteComponent} from '../roombooking/dialog-invite/dialog-invite.component';
import {FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {Rooms} from '../shared/model/rooms';
import {RoomService} from '../shared/service/room/room.service';
import {DOCUMENT} from '@angular/common';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.css']
})
export class VideoComponent implements AfterViewInit, OnInit {


    constructor(
        @Inject(DOCUMENT) private document: any,
        private dialog: MatDialog,
        private readonly renderer: Renderer2,
        private snackBar: MatSnackBar,
        private roomService: RoomService,
        private routeParams: ActivatedRoute) {
    }


    get participantCount() {
        return !!this.participants ? this.participants.size : 0;
    }

    get isAlone() {
        return this.participantCount === 0;
    }

    @ViewChild('participant', {static: false}) participant: ElementRef;
    @ViewChildren('participant') participantElem: QueryList<'participant'>;
    @ViewChild('preview', {static: false}) preview: ElementRef;
    @ViewChild('smallPreview', {static: false}) smallPreview: ElementRef;
    @ViewChild('shareElement', {static: false}) shareElement: ElementRef;
    @ViewChild('smallPreviewContainer', {static: false}) smallPreviewContainer: ElementRef;
    @Input() twilioToken: string;
    form: FormGroup;
    micOn = true;
    isPresenting = false;
    isJoining: boolean;
    activeRoom: any;
    showInfo = false;
    localInitial: string;
    // present
    stream;
    screenTrack;
    roomInfo: Rooms;
    fullScreen = false;
    speakerView = false;
    minimizePreview = false;
    showToolbar = true;
    showFullScreenBar = true;

    localTrack;
    elem: any;

    private participants: Map<Participant.SID, RemoteParticipant>;
    dominantSpeaker: Observable<RemoteParticipant>;
    localParticipant: Observable<LocalParticipant>;
    dataTrack = new LocalDataTrack();
    dataTrackPublished: any = {};

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

    ngOnInit() {
        this.elem = document.documentElement;
        this.routeParams.params.subscribe(params => {
            this.twilioToken = params.token;
            if (params.id != null) {
                this.getRoom(params.id);
            }
        });
    }


    @HostListener('document:fullscreenchange', ['$event'])
    @HostListener('document:webkitfullscreenchange', ['$event'])
    @HostListener('document:mozfullscreenchange', ['$event'])
    @HostListener('document:MSFullscreenChange', ['$event'])
    fullScreenMode() {
        this.fullScreen = !this.fullScreen;
        if (this.fullScreen) {
            let time = 0;
            const interval = setInterval(() => {
                time++;
                if (time === 10) {
                    this.showFullScreenBar = false;
                    clearInterval(interval);
                }
            }, 1000);
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
    }

    ngAfterViewInit(): void {
        if (isSupported) {
            this.connectRoom();
        } else {
            this.snackBar.open('This browser is not supported please visit our website on a computer or download our mobile app', 'Ok',
                {
                    verticalPosition: 'top',
                    panelClass: ['my-snackbar']
                });
        }
    }

    private getRoom(id: number) {
        this.localInitial = 'Me';
        this.roomService.getRoomById(id)
            .subscribe(data => {
                    this.roomInfo = data;
                },
                (error) => {
                },
            );
    }

    connectRoom() {
        createLocalTracks({
            audio: true,
            video: {
                mandatory: {
                    maxWidth: 1920,
                    maxHeight: 1080,
                    maxFrameRate: 10,
                    minAspectRatio: 1.77
                }
            }
        }).then(localTracks => {
            /*set preview*/
            this.localTrack = localTracks.find(track => track.kind === 'video');
            /* connect to twilio*/
            this.isJoining = true;
            return connect(this.twilioToken, {
                _useTwilioConnection: true,
                localTracks,
                dominantSpeaker: true
            } as ConnectOptions);
        }).then(room => {
            this.isJoining = false;
            this.activeRoom = room;
            this.initialize(this.activeRoom.participants);
            this.registerRoomEvents();
            this.publishDataTrack();
            this.localParticipant = this.activeRoom.localParticipant;
            this.localInitial = this.activeRoom.localParticipant.identity.substring(0, 1);
            this.toaster(`Connected to Room: ${this.activeRoom.name} as "${this.activeRoom.localParticipant.identity}"`);

            this.participants.set(this.activeRoom.localParticipant.sid, this.activeRoom.localParticipant);
            console.log(this.participants);
        }, _ => {
            this.isJoining = false;
            this.toaster('Failed to connect to room. Taking you back to your rooms');
            window.close();
        });
    }


    getParticipants() {
        if (!!this.participants) {
            return Array.from(this.participants).map(item => item[1]);
        } else {
            return [];
        }
    }

    toggleVoice() {
        if (this.activeRoom != null) {
            if (this.micOn) {
                this.micOn = false;
                this.activeRoom.localParticipant.audioTracks.forEach(publication => {
                    publication.track.disable();
                });
            } else {
                this.micOn = true;
                this.activeRoom.localParticipant.audioTracks.forEach(publication => {
                    publication.track.enable();
                });
            }
        }
    }

    present() {
        if (this.isPresenting) {
            this.isPresenting = false;
            this.activeRoom.localParticipant.unpublishTrack(this.screenTrack);
        } else {
            this.isPresenting = true;
            // share screen
            console.log('presenting');
            const mediaDevices = navigator.mediaDevices as any;
            mediaDevices.getDisplayMedia().then(stream => {
                this.stream = stream;
                this.screenTrack = new LocalVideoTrack(stream.getTracks()[0], {
                    priority: 'high',
                    name: 'screen'
                });
                this.activeRoom.localParticipant.publishTrack(this.screenTrack, {
                    priority: 'high',
                    name: 'screen'
                });
                this.screenTrack.once('stopped', () => {
                    this.isPresenting = false;
                    this.activeRoom.localParticipant.unpublishTrack(this.screenTrack);
                });
            }, _ => {
                this.isPresenting = false;
                this.toaster('Error Sharing Screen');
            });
        }

    }

    invite() {
        if (this.roomInfo !== null) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.autoFocus = true;
            dialogConfig.data = this.roomInfo;
            dialogConfig.panelClass = 'custom-dialog-container';
            const dialogRef = this.dialog.open(DialogInviteComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(
                data => console.log('Dialog output:', data)
            );
        }
    }

    toaster(message) {
        this.snackBar.open(message, 'Ok',
            {
                duration: 2000,
                verticalPosition: 'top',
                panelClass: ['my-snackbar']
            });
    }

    getUserInitial(name): string {
        return name.toString().substring(0, 2);
    }

    message(track) {
        if (track.kind === 'data') {
            track.on('message', data => {
                console.log(data);
            });
        }
    }

    getRoomUrl(id: number): string {
        return `${window.location.origin}/main/rooms/${id}`;
    }

    openFullscreen() {
        if (!this.fullScreen) {
            const methodToBeInvoked = this.elem.requestFullscreen ||
                this.elem.webkitRequestFullScreen || this.elem.mozRequestFullscreen
                || this.elem.msRequestFullscreen;
            if (methodToBeInvoked) {
                methodToBeInvoked.call(this.elem);
            }
        } else {
            const document: any = this.document;
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    toggleView() {
        this.speakerView = !this.speakerView;
    }

    private registerRoomEvents() {
        this.activeRoom
            .on('disconnected',
                (room: Room) => room.localParticipant.tracks.forEach(publication => this.detachLocalTrack(publication.track)))
            .on('participantConnected',
                (participant: RemoteParticipant) => this.add(participant))
            .on('participantDisconnected',
                (participant: RemoteParticipant) => this.remove(participant))
            .on('dominantSpeakerChanged',
                (dominantSpeaker: RemoteParticipant) => this.loudest(dominantSpeaker));
    }

    leaveRoom() {
        // To disconnect from a Room
        this.activeRoom.disconnect();
        if (this.activeRoom) {
            this.activeRoom.disconnect();
            this.activeRoom = null;
        }
        if (this.participants) {
            this.participants.clear();
        }
    }

    private detachLocalTrack(track: LocalTrack) {
        if (this.isDetachable(track)) {
            track.detach().forEach(el => el.remove());
        }
    }

    initialize(participants: Map<Participant.SID, RemoteParticipant>) {
        this.participants = participants;
        if (this.participants) {
            this.participants.forEach(participant => this.registerParticipantEvents(participant));
        }
    }

    add(participant: RemoteParticipant) {
        if (this.participants && participant) {
            this.participants.set(participant.sid, participant);
            this.registerParticipantEvents(participant);
        }
    }

    remove(participant: RemoteParticipant) {
        if (this.participants && this.participants.has(participant.sid)) {
            this.participants.delete(participant.sid);
        }
    }

    loudest(participant: RemoteParticipant) {
        this.dominantSpeaker = participant;
    }

    private registerParticipantEvents(participant: RemoteParticipant) {
        if (participant) {
            participant.tracks.forEach(publication => this.subscribe(publication));
            participant.on('trackPublished', publication => this.subscribe(publication));
            participant.on('trackUnpublished',
                publication => {
                    if (publication && publication.track) {
                        this.detachRemoteTrack(publication.track);
                    }
                });
            participant.on('trackSubscribed', track => {
                console.log(`Participant "${participant.identity}" added ${track.kind} Track ${track.sid}`);
                if (track.kind === 'data') {
                    track.on('message', data => {
                        console.log(data);
                    });
                }
            });
        }
    }

    private attachRemoteTrack(track: RemoteTrack) {
        if (this.isAttachable(track)) {
            const element = track.attach();
            this.renderer.data.id = track.sid;
            this.renderer.setStyle(element, 'width', '95%');
            this.renderer.setStyle(element, 'margin-left', '2.5%');
            // this.renderer.appendChild(this.listRef.nativeElement, element);
            // this.participantsChanged.emit(true);
        }
    }

    private detachRemoteTrack(track: RemoteTrack) {
        if (this.isDetachable(track)) {
            track.detach().forEach(el => el.remove());
            // this.participantsChanged.emit(true);
        }
    }

    private subscribe(publication: RemoteTrackPublication | any) {
        if (publication && publication.on) {
            publication.on('subscribed', track => this.attachRemoteTrack(track));
            publication.on('unsubscribed', track => this.detachRemoteTrack(track));
        }
    }

    private publishDataTrack() {
        this.activeRoom.localParticipant.publishTrack(this.dataTrack);
        this.dataTrackPublished.promise = new Promise((resolve, reject) => {
            this.dataTrackPublished.resolve = resolve;
            this.dataTrackPublished.reject = reject;
        });

        this.activeRoom.localParticipant.on('trackPublished', publication => {
            if (publication.track === this.dataTrack) {
                this.dataTrackPublished.resolve();
            }
        });

        this.activeRoom.localParticipant.on('trackPublicationFailed', (error, track) => {
            if (track === this.dataTrack) {
                this.dataTrackPublished.reject(error);
            }
        });
    }

    remoteUserMuted($event: boolean) {

    }

    sendMessage(mutedSid) {
        this.dataTrackPublished.promise.then(() => this.dataTrack.send(mutedSid));
    }

    isHost(identity: string): string {
        if (this.roomInfo != null && this.roomInfo.user.username === identity) {
            return '(Host)';
        } else {
            return '';
        }
    }
}

