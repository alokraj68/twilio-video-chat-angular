import {Component, Directive, EventEmitter, HostListener, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {CreateSuccessComponent} from '../create-success/create-success.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RoomService} from '../../shared/service/room/room.service';
import {MatDatepicker} from '@angular/material/datepicker';
import {Rooms} from '../../shared/model/rooms';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {finalize, tap} from 'rxjs/operators';
import * as moment from 'moment';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-dialog-schedule',
    templateUrl: './dialog-schedule.component.html',
    styleUrls: ['./dialog-schedule.component.css']
})

export class DialogScheduleComponent implements OnInit {

    @ViewChild('startDatepicker') startDatepicker: MatDatepicker<Date>;
    @ViewChild('endDatePicker') endDatepicker: MatDatepicker<Date>;

    @Output() dropped = new EventEmitter<FileList>();
    @Output() hovered = new EventEmitter<boolean>();

    form: FormGroup;
    loading = false;
    isHovering: boolean;
    task: AngularFireUploadTask;
    downloadURL;
    fileError;

    /*edit values*/
    actionText: string;
    eventName: string;
    price: number;
    maxNoPeople: number;
    description: string;
    startTime: string;
    endTime: string;
    eventDate: Date;
    minimumDate: Date;
    minimumTime: string;

    constructor(private dialog: MatDialog,
                private fb: FormBuilder,
                private snackBar: MatSnackBar,
                private storage: AngularFireStorage,
                private dialogRef: MatDialogRef<DialogScheduleComponent>,
                private roomService: RoomService,
                @Inject(MAT_DIALOG_DATA) public room: Rooms) {
    }

    ngOnInit(): void {
        this.minimumDate = new Date();
        this.minimumTime = moment().format('LT');
        if (this.room != null) {
            this.actionText = 'Update';
            this.downloadURL = this.room.imageUrl;
            this.eventName = this.room?.eventName;
            this.price = this.room?.price;
            this.maxNoPeople = this.room?.maxNoPeople;
            this.description = this.room?.description;
            this.eventDate = this.room?.eventDate;
            this.startTime = moment.unix(this.room?.startTime / 1000).format('HH:mm');
            this.endTime = moment.unix(this.room?.endTime / 1000).format('HH:mm');
        } else {
            this.actionText = 'Save';
        }

        this.form = this.fb.group({
            eventName: [this.eventName, Validators.required],
            price: [this.price, [Validators.required, Validators.min(0), Validators.max(9999), Validators.maxLength(4)]],
            maxNoPeople: [this.maxNoPeople, [Validators.required, Validators.min(2), Validators.max(50)]],
            description: [this.description, Validators.required],
            eventDate: [this.eventDate, [Validators.required]],
            startTime: [this.startTime, Validators.required],
            endTime: [this.endTime, Validators.required],
        });
    }

    save() {
        this.sendData();
        // make sure user is signed in
    }

    sendData() {
        if (this.form.invalid) {
            return;
        }
        if (this.downloadURL != null) {
            this.saveRequest();
        } else {
            this.snackBar.open('Please upload an image', 'Ok',
                {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['my-snackbar-error']
                });
        }
    }

    private saveRequest() {
        this.loading = true;
        const room: Rooms = this.form.value;
        if (this.room != null) {
            room.id = this.room.id;
        }
        room.imageUrl = this.downloadURL;
        room.eventDate = this.form.value.eventDate;
        room.startTime = new Date(new Date(room.eventDate).toDateString() + ' ' + this.form.value.startTime).getTime();
        room.endTime = new Date(new Date(room.eventDate).toDateString() + ' ' + this.form.value.endTime).getTime();
        this.roomService
            .sendRoomDetails(room)
            .subscribe(
                (data) => {
                    this.dialogRef.close(data);
                    this.loading = false;
                },
                (error) => {
                    this.loading = false;
                },
            );
    }

    close() {
        this.dialogRef.close(false);
    }

    toggleHover(event: boolean) {
        this.isHovering = event;
    }

    onDrop(file: FileList) {
        const image = file[0];
        this.validateFile(image);
    }

    private validateFile(image: File) {
        const fileSizeInKB = Math.round(image.size / 1024);
        if (fileSizeInKB >= 2048) {
            this.fileError = true;
        } else {
            this.fileError = false;
            this.startUpload(image);
        }
    }

    upload(file: any) {
        const image = file.files[0];
        this.validateFile(image);
    }

    startUpload(image: File) {
        this.loading = true;
        const path = `test/${Date.now()}_${image.name}`;
        const ref = this.storage.ref(path);
        this.task = this.storage.upload(path, image);
        this.storage.upload(path, image).snapshotChanges().pipe(
            finalize(() => {
                ref.getDownloadURL().subscribe((url) => {
                    this.downloadURL = url;
                    this.loading = false;
                });
            })
        ).subscribe();
    }
}
