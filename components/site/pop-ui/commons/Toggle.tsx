import { Field, FieldGroup } from "@/components/ui/toggle/field";
import * as SwitchPrimitive from "@radix-ui/react-switch";


export function SwitchSizes() {
  return (
    <FieldGroup className="w-full max-w-[10rem]">
      <Field orientation="horizontal">
        <SwitchPrimitive.Root id="switch-size-default" />
      </Field>
    </FieldGroup>
  );
}
