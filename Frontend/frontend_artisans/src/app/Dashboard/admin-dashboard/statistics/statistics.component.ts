import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  standalone: true,
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  
  constructor(private router: Router,private statistics: UserService) { }
  
    totalUsers: any = 0;
    artisan: any = 0;
    client: any = 0;
    livreur: any = 0;
   
  

  orderStats = {
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0
  };

 

  ngOnInit(): void {
    
    this.totalUsers = this.statistics.getStatisticsAllUsers().subscribe(
      (data)=>{
        this.totalUsers = data;
        
      },);

    this.artisan = this.statistics.getStatisticsUserByRole('artisan').subscribe(
      (data)=>{
        this.artisan = data;
        
      },);

    this.client = this.statistics.getStatisticsUserByRole('client').subscribe(
      (data)=>{
        this.client = data;
        
      },);

    this.livreur = this.statistics.getStatisticsUserByRole('livreur').subscribe(
      (data)=>{
        this.livreur = data;
        
      },);
      

  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}