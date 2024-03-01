import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { Cuestionario } from '../models/Cuestionario';
// import { Cuestionario } from '../interfaces/cuestionario';
import { Pregunta } from '../models/Pregunta';
// import { map } from 'rxjs/operators';
// import { DocumentSnapshot } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class QuizzService {
  tituloCuestionario: string = '';
  descripcion: string = '';
  private pregunta$ = new Subject<Pregunta>();

  constructor(private firestore: Firestore = inject(Firestore)) { }

  agregarPregunta(pregunta: Pregunta) {
    this.pregunta$.next(pregunta);
  }

  getPreguntas(): Observable<Pregunta> {
    return this.pregunta$.asObservable()
  }

  // crearCuestionario(cuestionario: Cuestionario): Promise<any> {
  //   return this._firestore.collection('cuestionarios').add(cuestionario);
  // }

  crearCuestionario(cuestionario: Cuestionario): Promise<any> {
    return addDoc(collection(this.firestore, 'cuestionarios'), cuestionario);
  }

  // getCuestionarioByIdUser(uid: string): Observable<any> {
  //   return this.firestore.collection('cuestionarios', ref => ref.where('uid', '==', uid)).snapshotChanges()
  // }

  getCuestionarioByIdUser(uid: string): Observable<any> {
    const cuestionarioRef = query(collection(this.firestore, 'cuestionarios'), where('uid', '==', uid));
    return collectionData(cuestionarioRef, { idField: 'id' }) as Observable<any>;
    // return this.firestore.collection('cuestionarios', ref => ref.where('uid', '==', uid)).snapshotChanges()
  }

  // eliminarCuestionario(idCuestionario: string): Promise<any> {
  //  return this._firestore.collection('cuestionarios').doc(idCuestionario).delete()
  // }

  eliminarCuestionario(id: string) {
    const cuestionarioDocRef = doc(this.firestore, `cuestionarios/${id}`);
    return deleteDoc(cuestionarioDocRef);
  }

  // getCuestionario(id: string): Observable<any> {
  //   return this._firestore.collection('cuestionarios').doc(id).get()
  // }

  getCuestionario(id: string): Observable<any> {
    const cuestionarioRef = collection(this.firestore, 'cuestionarios');
    return collectionData(cuestionarioRef, { idField: 'id'}) as Observable<any>;
  }

}
