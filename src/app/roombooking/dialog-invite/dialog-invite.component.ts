import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Rooms} from '../../shared/model/rooms';

@Component({
  selector: 'app-dialog-invite',
  templateUrl: './dialog-invite.component.html',
  styleUrls: ['./dialog-invite.component.css']
})
export class DialogInviteComponent implements OnInit {
    loading = null;
    link: string;

  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<DialogInviteComponent>,
      @Inject(MAT_DIALOG_DATA) public room: Rooms
  ) { }

  ngOnInit(): void {
    this.link = `${window.location.origin}/rooms/${this.room.id}`;
  }

  close() {
    this.dialogRef.close();
  }

}
