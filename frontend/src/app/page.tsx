'use client';

import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { List, Placeholder, Section } from '@telegram-apps/telegram-ui';
import { initDataState as _initDataState, useSignal } from '@telegram-apps/sdk-react';

import { Page } from '@/components/Page';
import { DisplayData } from '@/components/DisplayData/DisplayData';
import { bem } from '@/css/bem';

import './home-page.css';

const [, e] = bem('home-page');

export default function Home() {
  const wallet = useTonWallet();
  const initDataState = useSignal(_initDataState);

  if (!wallet) {
    return (
      <Page back={false}>
        <Placeholder
          className={e('placeholder')}
          header="O Grande Código"
          description={
            <div className={e('button-container')}>
              <TonConnectButton className={e('button')} />
            </div>
          }
        />
      </Page>
    );
  }

  return (
    <Page back={false}>
      <List>
        <Section header="Wallet Status">
          <TonConnectButton className={e('button-connected')} />
        </Section>
        {initDataState && (
          <DisplayData
            header="Init Data"
            rows={[
              { title: 'User ID', value: initDataState.user?.id },
              { title: 'Username', value: initDataState.user?.username },
              { title: 'First Name', value: initDataState.user?.first_name },
              { title: 'Last Name', value: initDataState.user?.last_name },
              { title: 'Language Code', value: initDataState.user?.language_code },
            ].filter(row => row.value !== undefined)}
          />
        )}
      </List>
    </Page>
  );
}
