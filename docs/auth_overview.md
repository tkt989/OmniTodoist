# Omni Todoist 認証方式の概要

本ソフトウェア（Omni Todoist）における Todoist API との認証・認可の仕組みについて。

## 採用方式
**OAuth 2.0 (PKCE 対応)**

Todoist への認可フローにおいて、クライアント側（本拡張機能）で生成した一時的な秘密（Code Verifier）を用いる PKCE (Proof Key for Code Exchange) を採用しています。

## 認証フローの概念
1. **認可リクエスト**:
   - ユーザーが「Login」ボタンを押すと、Todoist の認可ページがブラウザで開きます。
   - この際、PKCE 用の `code_challenge` を含めてリクエストを行います。
2. **認可コードの取得**:
   - `chrome.identity.launchWebAuthFlow` を利用し、Todoist からのコールバック（認可コード）を安全に受け取ります。
3. **アクセストークンの交換**:
   - 取得した認可コードと、最初に生成した `code_verifier` を Todoist のトークンエンドポイントに送信し、アクセストークンを取得します。
4. **トークンの永続化**:
   - 取得したトークンは、Chrome の同期ストレージ（`chrome.storage.sync`）に保存され、以降の API リクエストの `Authorization` ヘッダーで使用されます。

## 安全性について
- **PKCE の利用**: 認可コードの横取り攻撃を防ぎ、クライアントシークレットをソースコードに埋め込む必要性を排除（または補完）しています。
- **Chrome Identity API**: 拡張機能専用の認証フローを用いることで、リダイレクトURLの管理を安全に行っています。
