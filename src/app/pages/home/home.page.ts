import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion/ngx';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage {

	public typeOfUser: string;
	public pwdForm: FormGroup;

	public on;
	public interval;
	public subscription: any;
	public activado: boolean = false;
	public reproducir: boolean = true;
	public password;

	constructor(private route: ActivatedRoute,public router: Router, public deviceMotion: DeviceMotion, private flashlight: Flashlight, private vibration: Vibration) { }

	ngOnInit() {
		this.on = false;
		this.password = this.getPwdOfUser();
		this.initializeForm();
	
	}

	private initializeForm(): void {
		this.pwdForm = new FormGroup({
			'password': new FormControl(null, [Validators.required, Validators.maxLength(10)])
		});
	}

	private getPwdOfUser(): string {
		return this.route.snapshot.paramMap.get('password');
	}

	public onClick(): void {
		this.on = true;
		this.activado = true;
		try {
			const option: DeviceMotionAccelerometerOptions = {
				frequency: 500
			};

			this.subscription = this.deviceMotion.
				watchAcceleration(option).
				subscribe((acc: DeviceMotionAccelerationData) => {
					console.log(acc.x, acc.y, acc.z);

					if (acc.x > 8) {
						if (this.reproducir) {
							this.vibrar();
						}
					}
					else if (acc.x < -8) {
						if (this.reproducir) {
							this.vibrar();
						}
					}
					else if (acc.x > 3) {
						if (this.reproducir) {
							this.reproducirAudio("assets/Audio/MP3/Epa.mp3", false);
						}
					}
					else if (acc.x < -3) {
						if (this.reproducir) {
							this.reproducirAudio("assets/Audio/MP3/Estan.mp3", false);
						}
					}
					else if (acc.y > 4) {
						if (this.reproducir) {
							this.reproducirAudio("assets/Audio/MP3/Peligro.mp3", true);
						}
					}
					else if (acc.y < -4) {
						if (this.reproducir) {
							this.reproducirAudio("assets/Audio/MP3/Ayuda.mp3", true);
						}
					}
				});
		} catch (err) {
			alert('Error ' + err);
		}
	}


	public vibrar(): void {
		this.reproducir = false;
		this.vibration.vibrate(5000);
		setTimeout(() => {
			this.reproducir = true;
		}, 5000);
	}

	public reproducirAudio(path: string, flash: boolean): void {
		let audio = new Audio(path);
		audio.play();
		this.reproducir = false;
		if (flash) {
			this.flashlight.switchOn();
			setTimeout(() => {
				this.flashlight.switchOff();
				this.reproducir = true;
			}, 5000);
		}
		else {
			setTimeout(() => {
				this.reproducir = true;
			}, 3000);
		}
	}

	public offClick(): void {
		if(this.pwdForm.get('password').value == this.password){
			this.subscription.unsubscribe();
			this.on = false;
		}
		else{
			this.vibration.vibrate(2000);
			alert("Contraseña incorrecta !");
		}	
		this.pwdForm.get('password').setValue("");
		
	}

}
