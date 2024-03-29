import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Cuestionario } from 'src/app/models/Cuestionario';
import { QuizzService } from 'src/app/services/quizz.service';

@Component({
  selector: 'app-list-cuestionarios',
  templateUrl: './list-cuestionarios.component.html',
  styleUrls: ['./list-cuestionarios.component.css']
})
export class ListCuestionariosComponent implements OnInit, OnDestroy {

  suscriptionUser: Subscription = new Subscription();
  suscriptionQuizz: Subscription = new Subscription();
  listCuestionarios: Cuestionario[] = [];
  loading = false;

  constructor(private afAuth: AngularFireAuth,
    private router: Router,
    private _quizzService: QuizzService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loading = true;
    this.suscriptionUser = this.afAuth.user.subscribe(user => {
      console.log(user);
      if (user && user.emailVerified) {
        // cargar los cuestionarios
        this.getCuestionarios(user.uid);

      } else {
        this.router.navigate(['/']);
      }
    })
  }

  ngOnDestroy(): void {
    this.suscriptionUser.unsubscribe();
    this.suscriptionQuizz.unsubscribe();
  }

  getCuestionarios(uid: string) {
    this.suscriptionQuizz = this._quizzService.getCuestionarioByIdUser(uid).subscribe({
      next: data => {
        this.listCuestionarios = data.map((element: any) => ({
          id: element.id,
          ...(element as Cuestionario)  // Asumimos que element ya es un Cuestionario
        }));
        this.loading = false;
        console.log('data', this.listCuestionarios);
      },
      error: error => {
        console.log(error);
        this.toastr.error('Oops... ocurrió un error', 'Error');
        this.loading = false;
      }
    });
  }

  eliminarCuestionario(id: string) {
    this.loading = true;
    this._quizzService.eliminarCuestionario(id).then(data => {
      this.toastr.error('El Cuestionario fue eliminado con éxito', 'Registro eliminado!');
      this.loading = false;
    }).catch(() => {
      this.loading = false;
      this.toastr.error('Oops... ocurrió un error', 'Error');
    });
  }
}
