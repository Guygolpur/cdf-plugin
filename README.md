# CDF
<!-- # Guy Golpur 24/10/2021- KPMG -->

CDF plugin for Kibana 7.12.0

<dl>
  <dd>The purpose of this documentation is to guide you through the installation and usage process of the CDF plugin</dd>
</dl>

---

## Development

See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment.

## Start with Kibana

<dl>
  <dd>Install Git bash to your machine.</dd>
  <dd>Install the version of Node.js listed in the .node-version file.</dd>
  <dd>Clone the kibana repo, change directory into it, and then checkout to 7.12 branch.</dd>
  <dt><code>git clone https://github.com/[YOUR_USERNAME]/kibana.git kibana</code></dt>
  <dt><code>cd kibana</code></dt>
  <dt><code>git checkout 7.12</code></dt>

  <dd>Install the lastest version of yarn v1.</dd>

  <dd>Bootstrap Kibana and install all the dependencies:</dd>
  <dt><code>yarn kbn bootstrap</code></dt>
  <dd>Execute this to install node_modules and setup the dependencies in your plugin and in Kibana</dd>

  <dt><code>yarn plugin-helpers build</code></dt>
  <dd>Execute this to create a distributable version of this plugin that can be installed in Kibana</dd>
</dl>

## Start with CDF

<dl>
  <dd>Clone the CDF repo into the plugin directory.</dd>
  <dt><code>cd plugins</code></dt>
  <dt><code>git clone https://github.com/[YOUR_USERNAME]/cdf-plugin.git</code></dt>

  <dd>Run locally.</dd>
  <dt><code>yarn start --run-examples</code></dt>
</dl>

## Build

<dl>
  <dd>Execute the next commant:</dd>
  <dt><code>yarn plugin-helpers build</code></dt>
  <dd>Then, choose version 7.12.0 as the Kibana version</dd>
</dl>