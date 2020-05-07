import { Component } from '@angular/core';
import { Router } from "@angular/router"
import * as $ from "jquery";
///////////////////////////////////////
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { interval } from 'rxjs';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  interval;
  subscription: any;
  activado: boolean = false;
  reproducir: boolean = true;
  constructor(public router: Router, public deviceMotion: DeviceMotion, private flashlight: Flashlight, private vibration: Vibration) {}
  
  ngOnInit()
  {
    this.mostrarDesactivado();
  }

  start()
  {
    this.activado = true;
    this.mostrarActivado();
    try {
      const option: DeviceMotionAccelerometerOptions = {
      frequency: 500
    };

    this.subscription = this.deviceMotion.watchAcceleration(option).subscribe((acc: DeviceMotionAccelerationData) => {
      console.log(acc.x,acc.y,acc.z);

      if(acc.x > 8)
      {
        if(this.reproducir)
        {
          this.vibrar();
        }
      }
      else if(acc.x < -8)
      {
        if(this.reproducir)
        {
          this.vibrar();
        }
      }
      else if(acc.x > 3)
      {
        if(this.reproducir)
        {
          this.reproducirAudio("../assets/audio/sacaLaMano.mp3", false);
        }
      } 
      else if(acc.x < -3)
      {
        if(this.reproducir)
        {
          this.reproducirAudio("../assets/audio/soltame.mp3", false);
        }
      } 
      else if(acc.y > 4)
      {
        if(this.reproducir)
        {
          this.reproducirAudio("../assets/audio/epaQueHaces.mp3", true);
        }
      }
      else if(acc.y < -4)
      {
        if(this.reproducir)
        {
          this.reproducirAudio("../assets/audio/meRoban.mp3", true);
        }
      }
    });
    } catch (err) {
    alert('Error ' + err);
    }
  }

  clickInput()
  {
    $("#inputClave").val("");
    $("#inputClave").prop("type", "password");
  }

  esconder()
  {
    if(this.activado)
    {
      $("#divActivado").attr("hidden", true);
      $("#divDesactivado").attr("hidden", true);
      $("#botonActivar").attr("hidden", true);
      $("#botonDesactivar").attr("hidden", true);
      $("#botonVolver").attr("hidden", true);

      $("#inputClave").attr("hidden", false);
      $("#botonClave").attr("hidden", false);
    }
  }

  mostrarActivado()
  {
    $("#divActivado").attr("hidden", false);
    $("#divDesactivado").attr("hidden", true);
    $("#botonActivar").attr("hidden", false);
    $("#botonDesactivar").attr("hidden", false);
    $("#botonVolver").attr("hidden", false);

    $("#inputClave").attr("hidden", true);
    $("#botonClave").attr("hidden", true);

    $("#inputClave").val("Ingrese Constraseña");
    $("#inputClave").prop("type", "text");

    $("#botonVolver").prop("hidden", true);
    $("#botonActivar").attr("disabled", true);
    $("#botonDesactivar").attr("disabled", false);
  }

  mostrarDesactivado()
  {
    $("#divActivado").attr("hidden", true);
    $("#divDesactivado").attr("hidden", false);
    $("#botonActivar").attr("hidden", false);
    $("#botonDesactivar").attr("hidden", false);
    $("#botonVolver").attr("hidden", false);

    $("#inputClave").attr("hidden", true);
    $("#botonClave").attr("hidden", true);

    $("#inputClave").val("Ingrese Constraseña");
    $("#inputClave").prop("type", "text");
    
    
    $("#botonVolver").prop("hidden", false);
    $("#botonActivar").attr("disabled", false);
    $("#botonDesactivar").attr("disabled", true);
  }

  claveSubmit()
  {
    var clave = $("#inputClave").val();
    if(clave == localStorage.getItem("clave"))
    {
      this.activado = false;
      this.stop();
    }
    else
    {
      this.mostrarActivado();
      this.vibration.vibrate(2000);
      this.reproducirAudio("../assets/audio/claveError.mp3", false);
    }
  }

  stop()
  {
    this.subscription.unsubscribe();
    this.mostrarDesactivado();
  }

  vibrar()
  {
    this.reproducir = false;
    this.vibration.vibrate(5000);
    setTimeout(() => {
      this.reproducir = true;
    }, 5000);
  }

  reproducirAudio(ruta : string, flash : boolean)
  {
    let audio = new Audio(ruta);
    audio.play();
    this.reproducir = false;
    if(flash)
    {
      this.flashlight.switchOn();
      setTimeout(() => {
        this.flashlight.switchOff();
        this.reproducir = true;
      }, 5000);
    }
    else
    {
      setTimeout(() => {
        this.reproducir = true;
      }, 3000);
    }
  }

  returnToLogin()
  {
    if(this.activado)
    {
      this.stop();
    }
    $("#loadingContainer2").attr("hidden", false);
    localStorage.setItem("clave", "");
    setTimeout(() => {
      $("#loadingContainer2").attr("hidden", true);
      this.router.navigate(['/login']);
    }, 2000);
  }
}