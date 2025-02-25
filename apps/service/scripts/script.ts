import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as prompts from 'prompts';

// ----------

class ScriptRunner {
  private scripts: string[];

  constructor() {
    this.scripts = this.findScripts();
  }

  public async run(): Promise<void> {
    const script = process.argv[2] || (await this.chooseScript(this.scripts));

    if (!script) {
      return;
    }

    if (!this.scripts.includes(script)) {
      throw new Error(`Script "${script}" not found.`);
    }

    this.execute(script);
  }

  // --- INTERNAL FUNCTIONS ---

  private findScripts(): string[] {
    const scripts = fs.readdirSync('scripts');
    return scripts
      .filter(
        (script) => !['script.ts'].includes(script) && script.endsWith('.ts'),
      )
      .map((script) => script.replace('.ts', ''));
  }

  private async chooseScript(scripts: string[]): Promise<string> {
    const input = await prompts({
      type: 'select',
      name: 'script',
      message: 'Choose a script to run:',
      choices: scripts.map((script) => ({ title: script, value: script })),
    });

    return input.script as string;
  }

  private execute(script: string): void {
    const scriptPath = `scripts/${script}.ts`;
    console.log(`Running ts-node ${scriptPath}\n`);
    childProcess.execSync(`ts-node ${scriptPath}`, { stdio: 'inherit' });
  }
}

// ----- MAIN -----

const scriptRunner = new ScriptRunner();
scriptRunner.run().catch((error) => {
  console.error(error);
  process.exit(1);
});
