# OpenEdTex Production Monitoring Setup

This directory contains the monitoring stack configuration for the OpenEdTex platform.

## Components

- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **Alertmanager**: Alert management and notifications
- **Node Exporter**: System metrics collection
- **Django Prometheus**: Application metrics

## Quick Start

1. **Start the monitoring stack:**
   ```bash
   docker-compose -f docker-compose.monitoring.yml up -d
   ```

2. **Access the services:**
   - Grafana: http://localhost:3000 (admin/admin)
   - Prometheus: http://localhost:9090
   - Alertmanager: http://localhost:9093

3. **Configure Grafana:**
   - Login with admin/admin
   - The Prometheus datasource is auto-configured
   - Import the OpenEdTex dashboard from `/monitoring/grafana/dashboards/`

## Configuration Files

- `prometheus.yml`: Prometheus configuration with scrape targets
- `alertmanager.yml`: Alert routing and notification configuration
- `grafana/provisioning/datasources/prometheus.yml`: Grafana datasource config
- `grafana/dashboards/openedtex-overview.json`: Sample dashboard

## Metrics Collected

- Django application metrics (requests, response times, errors)
- System metrics (CPU, memory, disk, network)
- Database connection metrics
- Redis cache metrics
- Custom business metrics

## Alerts

Configured alerts include:
- High CPU usage
- High memory usage
- Application downtime
- Database connection issues
- Error rate thresholds

## Production Deployment

For production:
1. Update SMTP settings in `alertmanager.yml`
2. Configure persistent volumes for Prometheus and Grafana data
3. Set up proper SSL certificates
4. Configure firewall rules
5. Set up log aggregation (ELK stack)

## Troubleshooting

- Check container logs: `docker-compose -f docker-compose.monitoring.yml logs`
- Verify metrics endpoint: `curl http://localhost:8000/metrics`
- Check Prometheus targets: http://localhost:9090/targets
