# Google Cloud Run — configuración única (`sq-websites`)

Esta guía prepara el proyecto **sq-websites** y GitHub Actions para el workflow [`.github/workflows/deploy-cloud-run.yml`](../.github/workflows/deploy-cloud-run.yml).

## Qué debes tener listo

| Requisito | Detalle |
|-----------|---------|
| Cuenta GCP | Facturación activa (Cloud Run tiene tier gratuito acotado). |
| Proyecto | ID exacto: **`sq-websites`**. |
| Repositorio GitHub | El mismo que dispara el workflow (por defecto se asume `eidast/eidast-blog`; si cambia, ajusta el *principal* de WIF). |
| Herramientas locales | `gcloud` instalado y `gcloud auth login`. |

## 1. APIs y región

Región usada en el pipeline: **`us-central1`** (cámbiala en el YAML si usas otra).

```bash
export PROJECT_ID=sq-websites
export REGION=us-central1
gcloud config set project "$PROJECT_ID"

gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  cloudresourcemanager.googleapis.com
```

## 2. Artifact Registry (imagen Docker)

```bash
gcloud artifacts repositories create cloud-run \
  --repository-format=docker \
  --location="$REGION" \
  --description="Images for Cloud Run (sq-websites)"
```

## 3. Cuenta de servicio para GitHub Actions

```bash
export DEPLOY_SA="github-actions-cloud-run@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud iam service-accounts create github-actions-cloud-run \
  --display-name="GitHub Actions -> Cloud Run"

export PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
export COMPUTE_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${DEPLOY_SA}" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${DEPLOY_SA}" \
  --role="roles/artifactregistry.writer"

gcloud iam service-accounts add-iam-policy-binding "$COMPUTE_SA" \
  --member="serviceAccount:${DEPLOY_SA}" \
  --role="roles/iam.serviceAccountUser" \
  --project="$PROJECT_ID"
```

## 4. Workload Identity Federation (recomendado)

Evita JSON de cuenta de servicio en GitHub.

```bash
export POOL_ID=github
export PROVIDER_ID=github-oidc
export GITHUB_OWNER="eidast"          # tu usuario u organización
export GITHUB_REPO="eidast-blog"

gcloud iam workload-identity-pools create "$POOL_ID" \
  --project="$PROJECT_ID" \
  --location="global" \
  --display-name="GitHub Actions"

gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_ID" \
  --project="$PROJECT_ID" \
  --location="global" \
  --workload-identity-pool="$POOL_ID" \
  --display-name="GitHub OIDC" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository=='${GITHUB_OWNER}/${GITHUB_REPO}'"

gcloud iam service-accounts add-iam-policy-binding "$DEPLOY_SA" \
  --project="$PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/attribute.repository/${GITHUB_OWNER}/${GITHUB_REPO}"
```

Copia estos valores para GitHub:

| Tipo en GitHub | Nombre | Valor |
|----------------|--------|--------|
| **Secret** | `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github/providers/github-oidc` (ajusta si cambiaste `POOL_ID` / `PROVIDER_ID`) |
| **Secret** | `GCP_SERVICE_ACCOUNT_EMAIL` | `github-actions-cloud-run@sq-websites.iam.gserviceaccount.com` |

Sustituye `PROJECT_NUMBER` por el número numérico del proyecto (`gcloud projects describe sq-websites --format='value(projectNumber)'`).

## 5. Variable pública del sitio (GitHub)

En el repo: **Settings → Secrets and variables → Actions → Variables**.

| Variable | Ejemplo | Cuándo |
|----------|---------|--------|
| `PUBLIC_SITE_URL` | `https://eidast-blog-xxxxx-uc.a.run.app` | Tras el **primer** despliegue, copia la URL del servicio y pégala aquí (sin barra final). Vuelve a ejecutar el workflow para rebuildear con `NEXT_PUBLIC_SITE_URL` correcto. |

Hasta que exista la URL real, el primer deploy puede usar el placeholder del workflow; en cuanto tengas la URL de Cloud Run, configura la variable y haz **Re-run workflow** o un commit vacío.

## 6. Opción B — JSON de cuenta de servicio (menos recomendado)

1. Crea y descarga una clave JSON para `github-actions-cloud-run@...`.
2. En GitHub: **Secret** `GCP_SA_KEY` con el contenido del JSON.
3. En el workflow, sustituye el paso *Authenticate to Google Cloud* por:

```yaml
- uses: google-github-actions/auth@v2
  with:
    credentials_json: ${{ secrets.GCP_SA_KEY }}
```

Y elimina `workload_identity_provider` / `service_account` de ese paso.

## 7. Desplegar

- Push a **`main`** o **Actions → Deploy to Cloud Run → Run workflow**.
- Servicio: **`eidast-blog`**, imagen: **`us-central1-docker.pkg.dev/sq-websites/cloud-run/eidast-blog`**.

Comprobar:

```bash
gcloud run services describe eidast-blog --region=us-central1 --project=sq-websites --format='value(status.url)'
```

## Dominio propio (opcional)

En Cloud Console → Cloud Run → tu servicio → **Manage custom domains**, o con `gcloud beta run domain-mappings` según la documentación actual de Google. Actualiza `PUBLIC_SITE_URL` y redeploy.
