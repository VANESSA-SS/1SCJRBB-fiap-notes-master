import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NoteService } from 'src/app/services/note.service';
import { Note } from 'src/app/services/@types/note';

@Component({
  selector: 'app-form-note',
  templateUrl: './form-note.component.html',
  styleUrls: ['./form-note.component.css'],
})
export class FormNoteComponent implements OnInit {
  title = 'FIAP NOTES';
  logoImage = '/assets/logo.png';

  checkoutForm: FormGroup;

  subscription: Subscription;

  isEditing: boolean = false;

  idNote: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private noteService: NoteService
  ) {
    this.checkoutForm = this.formBuilder.group({
      textNote: ['', [Validators.required, Validators.minLength(5)]],
    });
    this.subscription = this.noteService.editNoteProvider.subscribe({
      next: (note: Note) => {

        this.checkoutForm.setValue({textNote:note.text});
        this.isEditing = true;
        this.idNote = note.id;
      },error: () => {}
    });
  }

  ngOnInit(): void {}

  sendNote() {
    // console.log(this.checkoutForm.get('textNote')?.errors);
    if (this.checkoutForm.valid) {
      if (this.isEditing){
        this.noteService.putNotes(this.idNote,this.checkoutForm.value.textNote).subscribe({
          //next é chamado quando as coisas dão certo
          next: (note) => {
            this.checkoutForm.reset();
            this.noteService.notifyEditedNote(note);
            this.isEditing = false;
          },
          //error é chamado no caso de excessões
          error: (error) => alert("Algo errado na edição! " + error)
        });

      }else{
        this.noteService.postNotes(this.checkoutForm.value.textNote).subscribe({
          //next é chamado quando as coisas dão certo
          next: (note) => {
            this.checkoutForm.reset();
            this.noteService.notifyNewNoteAdded(note);
          },
          //error é chamado no caso de excessões
          error: (error) => alert("Algo errado na inserção! " + error)
        });
      }
      
    }
  }

  get textNote() {
    return this.checkoutForm.get('textNote');
  }
}
