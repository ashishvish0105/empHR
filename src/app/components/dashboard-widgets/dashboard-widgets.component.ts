import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { DashboardStatsService } from '../../services/dashboard-stats.service';
import { DashboardStats } from '../../models/dashboard-stats.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-widgets',
  templateUrl: './dashboard-widgets.component.html',
  styleUrls: ['./dashboard-widgets.component.scss']
})
export class DashboardWidgetsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('platformChart') platformChartRef!: ElementRef;
  @ViewChild('rolesChart') rolesChartRef!: ElementRef;

  stats: DashboardStats | null = null;
  isLoading = true;
  private platformChart: Chart | null = null;
  private rolesChart: Chart | null = null;
  private destroy$ = new Subject<void>();

  constructor(private dashboardStatsService: DashboardStatsService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngAfterViewInit(): void {
    this.dashboardStatsService.stats$
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        if (stats) {
          this.stats = stats;
          this.updateCharts();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.platformChart) this.platformChart.destroy();
    if (this.rolesChart) this.rolesChart.destroy();
  }

  private loadStats(): void {
    this.isLoading = true;
    this.dashboardStatsService.getStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.stats = stats;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  private updateCharts(): void {
    if (!this.stats) return;

    this.updatePlatformChart();
    this.updateRolesChart();
  }

  private updatePlatformChart(): void {
    if (this.platformChart) {
      this.platformChart.destroy();
    }

    const ctx = this.platformChartRef.nativeElement.getContext('2d');
    const colors = this.dashboardStatsService.getChartColors();

    this.platformChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.stats!.platformUsage.map(item => item.platform),
        datasets: [{
          data: this.stats!.platformUsage.map(item => item.count),
          backgroundColor: colors.slice(0, this.stats!.platformUsage.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              padding: 20,
              font: {
                size: 12
              }
            }
          },
          title: {
            display: true,
            text: 'Platform Usage Distribution',
            font: {
              size: 16
            }
          }
        }
      }
    });
  }

  private updateRolesChart(): void {
    if (this.rolesChart) {
      this.rolesChart.destroy();
    }

    const ctx = this.rolesChartRef.nativeElement.getContext('2d');
    const colors = this.dashboardStatsService.getChartColors();

    this.rolesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.stats!.topSearchedRoles.map(item => item.role),
        datasets: [{
          label: 'Search Count',
          data: this.stats!.topSearchedRoles.map(item => item.count),
          backgroundColor: colors[1],
          borderColor: colors[1],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Top 5 Searched Roles',
            font: {
              size: 16
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              display: false
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  formatNumber(num: number): string {
    return this.dashboardStatsService.formatNumber(num);
  }
} 