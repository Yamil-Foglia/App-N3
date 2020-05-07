import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	constructor(private afs: AngularFireAuth) { }

	public loginEmail(email: string, pwd: string): Promise<unknown> {
		return new Promise((resolve, reject) => {
			this.afs.signInWithEmailAndPassword(email, pwd)
				.then(userData => {
					resolve(userData);
				})
				.catch(error => {
					reject(error);
				});
		})
	}

	public logoutEmail(): void {
		this.afs.signOut();
	}
}
